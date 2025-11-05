UPDATE `users` SET `password` = '$2a$12$8cjPevc3mVmw4DyQKXzt1eG9xsb7Sr.ZxseUQconM8wWj3j//4FpW';

ALTER TABLE `users` ADD UNIQUE(`login`);
ALTER TABLE `users` ADD UNIQUE(`email`);

