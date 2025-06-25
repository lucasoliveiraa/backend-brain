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
import { CreateProducerDto } from '../dto/create-producer.dto';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { ProducerEntity } from '../entities/producer.entity';
import { ProducerService } from '../service/producer.service';

@ApiTags('Producer')
@ApiBearerAuth('access-token')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @ApiOkResponse({
    description: 'Produtor criado com sucesso.',
    type: ProducerEntity,
  })
  @ApiOperation({
    summary: 'Criar um novo produtor',
    description: 'Cria um novo produtor no sistema.',
  })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producerService.create(createProducerDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de produtores recuperada com sucesso.',
    type: [ProducerEntity],
  })
  @ApiOperation({
    summary: 'Buscar todos os produtores',
    description: 'Busca uma lista de todos os produtores cadastrados.',
  })
  findAll() {
    return this.producerService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Produtor recuperado com sucesso.',
    type: ProducerEntity,
  })
  @ApiOperation({
    summary: 'Buscar um produtor por ID',
    description: 'Busca um produtor específico pelo seu ID.',
  })
  findOne(@Param('id') id: string) {
    return this.producerService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Produtor atualizado com sucesso.',
    type: ProducerEntity,
  })
  @ApiOperation({
    summary: 'Atualizar um produtor',
    description: 'Atualiza as informações de um produtor existente.',
  })
  update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    return this.producerService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Produtor removido com sucesso.',
    type: String,
  })
  @ApiOperation({
    summary: 'Remover um produtor por ID',
    description: 'Remove um produtor específico pelo seu ID. (soft delete)',
  })
  remove(@Param('id') id: string) {
    return this.producerService.remove(id);
  }
}
