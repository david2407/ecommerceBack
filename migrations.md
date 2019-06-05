node_modules/.bin/sequelize model:generate --name Case --attributes caseNumber:string,city:string,cityLbl:string,entity:string,entityLbl:string

node_modules/.bin/sequelize model:generate --name UserCase --attributes userId:integer,caseId:integer,description:string,active:boolean

node_modules/.bin/sequelize model:generate --name City --attributes label:string,value:string

node_modules/.bin/sequelize model:generate --name Entity --attributes label:string,value:string,cityId:integer
