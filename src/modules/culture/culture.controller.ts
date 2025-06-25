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
import { CultureService } from './culture.service';
import { CreateCultureDto } from './dto/create-culture.dto';
import { UpdateCultureDto } from './dto/update-culture.dto';
import { CultureEntity } from './entities/culture.entity';

@Controller('culture')
@ApiTags('Culture')
@ApiBearerAuth('access-token')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @Post()
  @ApiOkResponse({
    description: 'Cultura criada com sucesso.',
    type: CultureEntity,
  })
  @ApiOperation({
    summary: 'Criar uma nova cultura',
    description: 'Cria uma nova cultura no sistema.',
  })
  create(@Body() createCultureDto: CreateCultureDto) {
    return this.cultureService.create(createCultureDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de culturas recuperada com sucesso.',
    type: [CultureEntity],
  })
  @ApiOperation({
    summary: 'Buscar todas as culturas',
    description: 'Busca uma lista de todas as culturas cadastradas.',
  })
  findAll() {
    return this.cultureService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Cultura recuperada com sucesso.',
    type: CultureEntity,
  })
  @ApiOperation({
    summary: 'Buscar uma cultura por ID',
    description: 'Busca uma cultura específica pelo seu ID.',
  })
  findOne(@Param('id') id: string) {
    return this.cultureService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Cultura atualizada com sucesso.',
    type: CultureEntity,
  })
  @ApiOperation({
    summary: 'Atualizar uma cultura por ID',
    description: 'Atualiza uma cultura existente pelo seu ID.',
  })
  update(@Param('id') id: string, @Body() updateCultureDto: UpdateCultureDto) {
    return this.cultureService.update(id, updateCultureDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Cultura removida com sucesso.',
    type: CultureEntity,
  })
  @ApiOperation({
    summary: 'Remover uma cultura por ID',
    description: 'Remove uma cultura específica pelo seu ID.',
  })
  remove(@Param('id') id: string) {
    return this.cultureService.remove(id);
  }
}
