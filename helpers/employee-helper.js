const { ddbClient } = require('./ddbclient');
const { ScanCommand, PutItemCommand, QueryCommand, GetItemCommand, DeleteItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

class EmployeeService {
    constructor() {
        this.TABLENAME = "Employees";
    }

    async getAllEmployees() {
        let params = {
            TableName: this.TABLENAME,
            //Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            // FilterExpression: 'Department = :dept',
            // ExpressionAttributeValues: {
            // ':dept' : {S: 'IT'}
            // },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            // "#Ename":"Name",
            // "#Loc":"Location"
            // }
        }

        let result = await ddbClient.send(new ScanCommand(params))
            .catch(err => {
                console.log("Cust err:" + err);
                return Promise.reject(err);
            });
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees);

        // return ddbClient.send(new ScanCommand(params));
    }

    addEmployee(employee) {
        let params = {
            TableName: 'Employees',

            Item: marshall(employee)
            // Item: {
            //     LocationID: { S: employee.LocationID },
            //     EmpCode: { S: employee.EmpCode },
            //     Name: { S: employee.Name },
            //     Age: { N: employee.Age },
            //     Location: { S: employee.Location },
            //     Designation: { S: employee.Designation },
            //     Department: { S: employee.Department }
            // }
        };
        console.log(params);
        return ddbClient.send(new PutItemCommand(params));
    }

    async getEmployeesByLocation(locationId) {
        var params = {
            TableName: this.TABLENAME,
            KeyConditionExpression: "LocationID = :locId",
            ExpressionAttributeValues: {
                ":locId": { 'S': locationId }
            }
        };
        
        let result = await ddbClient.send(new QueryCommand(params))
            .catch(err => Promise.reject(err));
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
        
        // return ddbClient.send(new QueryCommand(params));
    }

    async getEmployee(locationId, empCode) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            }
        };        
        let result = await ddbClient.send(new GetItemCommand(params))
            .catch(err => Promise.reject(err));

        return Promise.resolve(result.Item ? unmarshall(result.Item) : undefined)
    }

    deleteEmployee(locationId, empCode) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            }
        };
        return ddbClient.send(new DeleteItemCommand(params));
    }

    updateEmployee(locationId, empCode, employee) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationID": { "S": locationId },
                "EmpCode": { "S": empCode }
            },
            UpdateExpression: 'set Designation = :desg, Department = :dept, #Name = :name, #Location = :loc, Age = :age',
            ExpressionAttributeNames: {
                '#Name': 'Name',
                '#Location': 'Location'
            },
            ExpressionAttributeValues: {
                ':desg': { S: employee.Designation },
                ':dept': { S: employee.Department },
                ':name': { S: employee.Name },
                ':loc': { S: employee.Location },
                ':age': { N: employee.Age }
            },
            ReturnValues: 'UPDATED_NEW'
        };

        return ddbClient.send(new UpdateItemCommand(params));
    }
}

module.exports = { EmployeeService };