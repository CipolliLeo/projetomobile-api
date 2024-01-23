import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResultadoDto } from 'src/dto/resultado.dto';
import * as bcrypt from 'bcrypt';
import { Produto } from './produto.entity';
import { ProdutoCadastrarDto } from './dto/produto.cadastrar.dto';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @Inject('PRODUTO_REPOSITORY')
    private produtoRepository: Repository<Produto>,
  ) {}

  async listar(): Promise<Produto[]> {
    return this.produtoRepository.find();
  }

  async deleteProduto(id: number): Promise<ResultadoDto> {
    const produto = await this.produtoRepository.findOne({
      where: { id: id },
    });

    if (!produto) {
      return <ResultadoDto>{
        status: false,
        mensagem: 'Não foi possível encontrar o produto',
      };
    } else {
      this.produtoRepository
        .remove(produto)
        .then(() => {
          return <ResultadoDto>{
            status: true,
            mensagem: 'Produto deletado com sucesso',
          };
        })
        .catch(() => {
          return <ResultadoDto>{
            status: false,
            mensagem: 'Houve um erro ao deletar o produto',
          };
        });
    }
  }

  async cadastrar(
    data: ProdutoCadastrarDto,
    usuario: Usuario,
  ): Promise<ResultadoDto> {
    let produto = new Produto();
    produto.titulo = data.titulo;
    produto.descricao = data.descricao;
    produto.valor = data.valor;
    produto.usuario = usuario;
    return this.produtoRepository
      .save(produto)
      .then(() => {
        return <ResultadoDto>{
          status: true,
          mensagem: 'Produto cadastrado com sucesso',
        };
      })
      .catch(() => {
        return <ResultadoDto>{
          status: false,
          mensagem: 'Houve um erro ao cadastrar o produto',
        };
      });
  }
}
