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
| routes | json | description |
| --- | --- |
| `login` | `{data:{email:String, password:{String,min 5} }` | encryption base64 ex. `{data:hf2i1jhflasjdfyuyfas3}` |
| `signup` | `{data:{email:String, password:{String,min 5},name:String }` | encryption base64 |
