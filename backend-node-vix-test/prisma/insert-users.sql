-- Script SQL para inserir 3 usuários no banco de dados
-- Este script usa hashes bcrypt pré-calculados.

INSERT INTO `user` (
  `idUser`,
  `username`,
  `email`,
  `password`,
  `role`,
  `isActive`,
  `createdAt`,
  `updatedAt`
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin',
  'admin@vituax.com',
  '$2a$10$iiw9qVvguGUQLTXb0G5hSOtxL0Xi83jxhCBSgmOWD568Qb5zwd8Zi',
  'admin',
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `username` = VALUES(`username`),
  `email` = VALUES(`email`),
  `password` = VALUES(`password`),
  `role` = VALUES(`role`),
  `isActive` = VALUES(`isActive`),
  `updatedAt` = NOW();

INSERT INTO `user` (
  `idUser`,
  `username`,
  `email`,
  `password`,
  `role`,
  `isActive`,
  `createdAt`,
  `updatedAt`
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'manager',
  'manager@vituax.com',
  '$2a$10$g.ElJsl84L6Uu96AjPsG9eVQXlSQgKnS0TnW3WMnU9BhzEoZTtzW.',
  'manager',
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `username` = VALUES(`username`),
  `email` = VALUES(`email`),
  `password` = VALUES(`password`),
  `role` = VALUES(`role`),
  `isActive` = VALUES(`isActive`),
  `updatedAt` = NOW();

INSERT INTO `user` (
  `idUser`,
  `username`,
  `email`,
  `password`,
  `role`,
  `isActive`,
  `createdAt`,
  `updatedAt`
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'member',
  'member@vituax.com',
  '$2a$10$8kstIf/TT0H7USUVX.DtxudUcG87rexGnsvuBe.tOw2fv6hixhVm2',
  'member',
  true,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `username` = VALUES(`username`),
  `email` = VALUES(`email`),
  `password` = VALUES(`password`),
  `role` = VALUES(`role`),
  `isActive` = VALUES(`isActive`),
  `updatedAt` = NOW();


