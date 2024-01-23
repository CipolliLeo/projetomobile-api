import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { TokenService } from 'src/token/token.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { ProdutoCadastrarDto } from './dto/produto.cadastrar.dto';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';

@Controller('produto')
export class ProdutoController {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly tokenService: TokenService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('listar')
  async listar(): Promise<Produto[]> {
    return this.produtoService.listar();
  }

  @UseGuards(JwtAuthGuard)
  @Post('cadastrar')
  async cadastrar(
    @Body() data: ProdutoCadastrarDto,
    @Req() req,
  ): Promise<ResultadoDto> {
    let token = req.headers.authorization;
    let usuario: Usuario = await this.tokenService.getUsuarioByToken(token);
    if (usuario) {
      return this.produtoService.cadastrar(data, usuario);
    } else {
      throw new HttpException(
        {
          errorMessage: 'Token inválido',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduto(@Param('id') id: number) {
    return this.produtoService.deleteProduto(id);
  }
}
