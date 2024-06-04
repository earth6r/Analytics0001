- need to fix skeletons
- change ./ to @/
- start tracking ips and calling ip info before saving to registers db
- file structuring
- tooltip for +x for badges
- break up register/messages/emails into different trpc components
- fix all types

- change time to epoch for register and all other time related fields
- fix `@ts-expect-error - fix this` in all files
- fix `eslint-disable-next-line @typescript-eslint/no-unsafe-call` in all files

curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test@test.com"}' http://localhost:3000/api/login

curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test@test.com"}' https://analytics0001.vercel.app/api/login

curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com"}' http://localhost:3000/api/user-existence

curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com"}' https://analytics0001.vercel.app/api/user-existence




REDO LOGIN:
- three different endpoints
- 1. for seeing if email exists and to give back a code saying "display_password" or "reset_password"
- 2. for logging in with email and password
- 3. for resetting password
- add api key to all endpoints
