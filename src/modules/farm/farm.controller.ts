import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmEntity } from './entities/farm.entity';
import { FarmService } from './farm.service';

@ApiTags('Farm')
@ApiBearerAuth('access-token')
@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @ApiOkResponse({
    description: 'Fazenda criada com sucesso.',
    type: FarmEntity,
  })
  @ApiOperation({
    summary: 'Criar uma nova fazenda',
    description: 'Cria uma nova fazenda no sistema.',
  })
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.create(createFarmDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de fazendas recuperada com sucesso.',
    type: [FarmEntity],
  })
  @ApiOperation({
    summary: 'Buscar todas as fazendas',
    description: 'Busca uma lista de todas as fazendas cadastradas.',
  })
  findAll() {
    return this.farmService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Fazenda recuperada com sucesso.',
    type: FarmEntity,
  })
  @ApiOperation({
    summary: 'Buscar uma fazenda por ID',
    description: 'Busca uma fazenda específica pelo seu ID.',
  })
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Fazenda atualizada com sucesso.',
    type: FarmEntity,
  })
  @ApiOperation({
    summary: 'Atualizar uma fazenda por ID',
    description: 'Atualiza uma fazenda específica pelo seu ID.',
  })
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Fazenda removida com sucesso.',
    type: FarmEntity,
  })
  @ApiOperation({
    summary: 'Remove uma fazenda por ID',
    description: 'Remove uma fazenda específica pelo seu ID.',
  })
  remove(@Param('id') id: string) {
    return this.farmService.remove(id);
  }
}
