// import { CultureEntity } from '../../../modules/culture/entities/culture.entity';
// import { FarmEntity } from '../../../modules/farm/entities/farm.entity';
// import { CulturePlantedEntity } from '../../../modules/harvest/entities/culture-planted.entity';
// import { HarvestEntity } from '../../../modules/harvest/entities/harvest.entity';
// import { ProducerEntity } from '../../../modules/producer/entities/producer.entity';
// import { UserEntity } from '../../../modules/user/entities/user.entity';
// import { DataSource } from 'typeorm';

// import { hash } from 'bcryptjs';
// import 'dotenv/config';

// // ⚙️ Criação da conexão temporária
// const dataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DATABASE_HOST,
//   port: Number(process.env.DATABASE_PORT),
//   username: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_DB,
//   entities: [
//     ProducerEntity,
//     FarmEntity,
//     HarvestEntity,
//     CultureEntity,
//     CulturePlantedEntity,
//     UserEntity,
//   ],
//   synchronize: false,
// });

// async function runSeed() {
//   await dataSource.initialize();
//   console.log('📦 Banco conectado com sucesso');

//   const manager = dataSource.manager;

//   // Usuário admin
//   const user = manager.create(UserEntity, {
//     name: 'Admin Teste',
//     email: 'admin@teste.com',
//     password: await hash('12345678', 12),
//   });
//   await manager.save(user);

//   // Culturas
//   const cultures = ['Soja', 'Milho', 'Café'].map((nome) =>
//     manager.create(CultureEntity, { name: nome }),
//   );
//   await manager.save(cultures);

//   // Produtores
//   const producers = [
//     manager.create(ProducerEntity, {
//       cpfCnpj: '62889960846',
//       name: 'João da Fazenda',
//     }),
//     manager.create(ProducerEntity, {
//       cpfCnpj: '24233207000174',
//       name: 'Maria da Terra',
//     }),
//   ];
//   await manager.save(producers);

//   const farms: FarmEntity[] = [];
//   for (const producer of producers) {
//     for (let i = 1; i <= 2; i++) {
//       farms.push(
//         manager.create(FarmEntity, {
//           name: `Fazenda ${i} de ${producer.name.split(' ')[0]}`,
//           city: i != 1 ? 'Belo Horizonte' : 'Sorocaba',
//           state: i != 1 ? 'MG' : 'SP',
//           areaTotal: 200,
//           areaAgricultural: 120,
//           areaVegetation: 80,
//           producer,
//         }),
//       );
//     }
//   }

//   await manager.save(farms);

//   const harvests: HarvestEntity[] = [];
//   for (const farm of farms) {
//     const harvest = manager.create(HarvestEntity, {
//       name: `Safra ${farm.name}`,
//       year: 2023,
//       farm,
//     });
//     harvests.push(harvest);
//   }

//   await manager.save(harvests);

//   const culturePlanted: CulturePlantedEntity[] = [];
//   for (const harvest of harvests) {
//     for (const culture of cultures) {
//       culturePlanted.push(
//         manager.create(CulturePlantedEntity, {
//           harvest,
//           culture,
//         }),
//       );
//     }
//   }

//   await manager.save(culturePlanted);

//   console.log('✅ Seed finalizado com sucesso!');
//   await dataSource.destroy();
// }

// runSeed().catch((err) => {
//   console.error('❌ Erro no seed', err);
//   process.exit(1);
// });
