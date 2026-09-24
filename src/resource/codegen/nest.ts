import { typescriptFieldType } from "../field-types.js";
import type { GenerateResourceContext } from "../types.js";

export function renderModule(ctx: GenerateResourceContext): string {
  const { naming } = ctx;
  const { pascal, plural } = naming;
  return `import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ${pascal}Controller } from './${plural}.controller';
import { ${pascal}Service } from './${plural}.service';

@Module({
  imports: [AuthModule],
  controllers: [${pascal}Controller],
  providers: [${pascal}Service],
  exports: [${pascal}Service],
})
export class ${pascal}Module {}
`;
}

export function renderCreateDto(ctx: GenerateResourceContext): string {
  const { naming, scope } = ctx;
  const { pascal, singular } = naming;
  return `import { createZodDto } from 'nestjs-zod';
import { create${pascal}InputSchema } from '${scope}/contracts';

export class Create${pascal}Dto extends createZodDto(create${pascal}InputSchema) {}
`;
}

export function renderUpdateDto(ctx: GenerateResourceContext): string {
  const { naming, scope } = ctx;
  const { pascal, singular } = naming;
  return `import { createZodDto } from 'nestjs-zod';
import { update${pascal}InputSchema } from '${scope}/contracts';

export class Update${pascal}Dto extends createZodDto(update${pascal}InputSchema) {}
`;
}

export function renderService(ctx: GenerateResourceContext): string {
  const { naming, fields } = ctx;
  const { pascal, plural, singular } = naming;
  const prismaDelegate = singular;

  const createData = fields
    .map((f) => `        ${f.name}: createDto.${f.name},`)
    .join("\n");
  const updateDataLines = fields
    .map(
      (f) =>
        `    if (updateDto.${f.name} !== undefined) {\n      data.${f.name} = updateDto.${f.name};\n    }`,
    )
    .join("\n");

  const selectFields = [
    "        id: true,",
    ...fields.map((f) => `        ${f.name}: true,`),
    "        createdAt: true,",
    "        updatedAt: true,",
  ].join("\n");

  return `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Create${pascal}Dto } from './dto/create-${singular}.dto';
import { Update${pascal}Dto } from './dto/update-${singular}.dto';

@Injectable()
export class ${pascal}Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: Create${pascal}Dto) {
    return this.prisma.${prismaDelegate}.create({
      data: {
${createData}
      },
      select: {
${selectFields}
      },
    });
  }

  async findAll() {
    return this.prisma.${prismaDelegate}.findMany({
      select: {
${selectFields}
      },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.${prismaDelegate}.findUnique({
      where: { id },
      select: {
${selectFields}
      },
    });

    if (!record) {
      throw new NotFoundException('${pascal} not found');
    }

    return record;
  }

  async update(id: string, updateDto: Update${pascal}Dto) {
    await this.findOne(id);

    const data: {
${fields.map((f) => `      ${f.name}?: ${typescriptFieldType(f.type)};`).join("\n")}
    } = {};

${updateDataLines}

    return this.prisma.${prismaDelegate}.update({
      where: { id },
      data,
      select: {
${selectFields}
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.${prismaDelegate}.delete({ where: { id } });
    return { message: '${pascal} deleted successfully' };
  }
}
`;
}

export function renderServiceSpec(ctx: GenerateResourceContext): string {
  const { naming } = ctx;
  const { pascal, plural, singular } = naming;
  const prismaDelegate = singular;

  return `import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ${pascal}Service } from './${plural}.service';

describe('${pascal}Service', () => {
  let service: ${pascal}Service;
  const prisma = {
    ${prismaDelegate}: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${pascal}Service,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(${pascal}Service);
    jest.clearAllMocks();
  });

  it('findOne throws when record is missing', async () => {
    prisma.${prismaDelegate}.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
  });
});
`;
}

export function renderController(ctx: GenerateResourceContext): string {
  const { naming } = ctx;
  const { pascal, plural, singular } = naming;
  return `import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ${pascal}Service } from './${plural}.service';
import { AuthGuard } from '../auth/auth.guard';
import { Create${pascal}Dto } from './dto/create-${singular}.dto';
import { Update${pascal}Dto } from './dto/update-${singular}.dto';

@ApiTags('${plural}')
@Controller('${plural}')
export class ${pascal}Controller {
  constructor(private readonly ${plural}Service: ${pascal}Service) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new ${singular}' })
  create(@Body() createDto: Create${pascal}Dto) {
    return this.${plural}Service.create(createDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all ${plural}' })
  @ApiResponse({ status: 200, description: 'List of ${plural}' })
  findAll() {
    return this.${plural}Service.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a ${singular} by ID' })
  @ApiResponse({ status: 200, description: '${pascal} found' })
  @ApiResponse({ status: 404, description: '${pascal} not found' })
  findOne(@Param('id') id: string) {
    return this.${plural}Service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a ${singular}' })
  update(@Param('id') id: string, @Body() updateDto: Update${pascal}Dto) {
    return this.${plural}Service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a ${singular}' })
  remove(@Param('id') id: string) {
    return this.${plural}Service.remove(id);
  }
}
`;
}
