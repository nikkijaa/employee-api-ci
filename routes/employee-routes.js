const { Router } = require('express');
const res = require('express/lib/response');
const { EmployeeService } = require('../helpers/employee-helper');

var router = Router();
var empSvc = new EmployeeService();

//Get all employee
//GET http://localhost:5000/employees
//GET /employees

// router.get("/", async (req, res) => {
//     let emps = await empSvc.getAllEmployees()
//         .catch(err => res.status(500).json({ 'message': 'Unable to read the employees' }));
//     if (emps) {
//         res.status(200).json(emps.Items);
//     }
// });

router.get("/", async(req,res)=>{
    let emps = await empSvc.getAllEmployees()
        .catch(err=>{
            console.log(err);
            res.status(500).json({ 'message':'Unable to read the employees' });
        })
    res.status(200).json(emps);
});


router.post("/", async (req, res) => {
    let employee = req.body;
    let result = await empSvc.addEmployee(employee)
        .catch(err => {
            res.status(500).json({ 'message': 'Unable to read the employees' })
        }
        );
    if (result) {
        res.status(201).json({ 'message': 'Employee addedd successfully' });
    }
});


//Get employees from a location
//GET /employees/location/:locId
// router.get('/location/:locId', async (req, res) => {
//     let locationId = req.params["locId"];
//     let result = await empSvc.getEmployeesByLocation(locationId)
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ 'message': 'Error in fetching employees data' })
//         })
//     if (result) {
//         res.status(200).json(result.Items);
//     }
// });

//Get employees from a location
//GET /employees/location/:locId
router.get('/location/:locId', async(req,res)=>{
    let locationId = req.params["locId"];
    let result = await empSvc.getEmployeesByLocation(locationId)
        .catch(err=>{
            console.log(err);
            res.status(500).json({'message':'Error in fetching employees data'})
        })
    if(result){
        res.status(200).json(result);
    }
});


//Get a single employee
//GET /employees/location/:locId/empcode/:ecode
router.get("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.getEmployee(locationId,empCode)
        .catch(err=>{
            console.log(err);
            res.status(500).json({ 'message': 'Unable to get employee details'})
        })
    if(result){
        res.status(200).json(result);
    }else{
        res.status(404).json({'message':'Employee not found'})
    }
});

//Delete the employee
//DELETE /employees/location/:locId/empcode/:ecode
router.delete("/location/:locId/empcode/:ecode", async (req, res) => {
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.deleteEmployee(locationId, empCode)
        .catch(err => {
            console.log(err);
            res.status(500).json({ 'message': 'Unable to delete' });
        });
    if(result){
        res.status(200).json({'message':'Deleted successfully'});
    }
});



//Update the employee
//PUT /employees/location/:locId/empcode/:ecode
router.put("/location/:locId/empcode/:ecode", async (req, res) => {
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let employee = req.body;
    
    let result = await empSvc.updateEmployee(locationId,empCode,employee)
        .catch(err=>{
            console.log(err);
            res.status(500).json({'message':'Error in updating'});
        });
        if(result){
            res.status(200).json(result.Attributes);
        }
});

module.exports =  router; 
