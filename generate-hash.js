import bcrypt from 'bcrypt';

const password = '123456';

bcrypt.hash(password, 10).then(hash => {
  console.log('Generated hash:', hash);
});
