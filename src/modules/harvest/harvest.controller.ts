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
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestEntity } from './entities/harvest.entity';
import { HarvestService } from './harvest.service';

@Controller('harvest')
@ApiTags('Harvest')
@ApiBearerAuth('access-token')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @ApiOkResponse({
    description: 'Safra criada com sucesso.',
    type: HarvestEntity,
  })
  @ApiOperation({
    summary: 'Criar uma nova safra',
    description: 'Cria uma nova safra no sistema.',
  })
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestService.create(createHarvestDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de safras recuperada com sucesso.',
    type: [HarvestEntity],
  })
  @ApiOperation({
    summary: 'Buscar todas as safras',
    description: 'Busca uma lista de todas as safras cadastradas.',
  })
  findAll() {
    return this.harvestService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Safra recuperada com sucesso.',
    type: HarvestEntity,
  })
  @ApiOperation({
    summary: 'Buscar uma safra por ID',
    description: 'Busca uma safra específica pelo seu ID.',
  })
  findOne(@Param('id') id: string) {
    return this.harvestService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Safra atualizada com sucesso.',
    type: HarvestEntity,
  })
  @ApiOperation({
    summary: 'Atualizar uma safra existente',
    description: 'Atualiza uma safra existente no sistema.',
  })
  update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestService.update(id, updateHarvestDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Safra removida com sucesso.',
    type: HarvestEntity,
  })
  @ApiOperation({
    summary: 'Remover uma safra por ID',
    description: 'Remove uma safra específica pelo seu ID.',
  })
  remove(@Param('id') id: string) {
    return this.harvestService.remove(id);
  }
}
