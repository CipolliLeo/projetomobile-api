import { DataSource } from 'typeorm';
import { Produto } from './produto.entity';

export const produtoProviders = [
  {
    provide: 'PRODUTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Produto),
    inject: ['DATA_SOURCE'],
  },
];
