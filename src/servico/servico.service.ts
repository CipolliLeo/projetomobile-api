import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResultadoDto } from 'src/dto/resultado.dto';
import * as bcrypt from 'bcrypt';
import { Servico } from './servico.entity';
import { ServicoCadastrarDto } from './dto/servico.cadastrar.dto';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class ServicoService {
  constructor(
    @Inject('SERVICO_REPOSITORY')
    private servicoRepository: Repository<Servico>,
  ) {}

  async listar(): Promise<Servico[]> {
    return this.servicoRepository.find();
  }

  async deleteServico(id: number): Promise<ResultadoDto> {
    const servico = await this.servicoRepository.findOne({
      where: { id: id },
    });

    if (!servico) {
      return <ResultadoDto>{
        status: false,
        mensagem: 'Não foi possível encontrar o serviço',
      };
    } else {
      this.servicoRepository
        .remove(servico)
        .then(() => {
          return <ResultadoDto>{
            status: true,
            mensagem: 'Serviço deletado com sucesso',
          };
        })
        .catch(() => {
          return <ResultadoDto>{
            status: false,
            mensagem: 'Houve um erro ao deletar o serviço',
          };
        });
    }
  }

  async cadastrar(
    data: ServicoCadastrarDto,
    usuario: Usuario,
  ): Promise<ResultadoDto> {
    let servico = new Servico();
    servico.titulo = data.titulo;
    servico.descricao = data.descricao;
    servico.valor = data.valor;
    servico.estado = data.estado;
    servico.usuario = usuario;
    return this.servicoRepository
      .save(servico)
      .then(() => {
        return <ResultadoDto>{
          status: true,
          mensagem: 'Serviço cadastrado com sucesso',
        };
      })
      .catch(() => {
        return <ResultadoDto>{
          status: false,
          mensagem: 'Houve um erro ao cadastrar o serviço',
        };
      });
  }
}
