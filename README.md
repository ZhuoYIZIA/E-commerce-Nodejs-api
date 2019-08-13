# E-commerce-Nodejs-api

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## APIs

### auth
| API | json | Description |
| --- | --- |
| `/login` | `{data: { email:test@email.com, password:test }` } | login email and password use crypt base64 ex. 
`{ data : asdfaxhjkhfhwasdhjkfe }` |
| `/signup` | `{data: { email:test@email.com, password:test, name:test }` | signup email, password,name use crypt base64 like login |
| `/EditProfile` | `{name:String, address:String, phone:Number}` | edit your profile |
| `/AddCart/:productId` | `{ quantity: Number }` | add product to cart |
| `/EditCart/:cartId` | `{ quantity: Number }` | edit quantity |
| `/DelectCart/:cartId` |  | delete product in cart |
| `/resetPwd` | `{ data: { newPwd:Strong, oldPwd:String } }` | use base64 like login |
<!-- | `/forgetPwd` | Show file differences that  staged | -->