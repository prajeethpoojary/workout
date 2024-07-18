const { json } = require('express')
const WorkoutSchema = require('../models/WorkoutSchema')
const mongoose = require('mongoose')

const getWorkouts = async(req,res)=>{
    const user_id=req.user
    const workouts = await WorkoutSchema.find({user_id}).sort({createdAt:-1})
    try {
        res.status(200).json(workouts)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


const getWorkout = async(req,res)=>{

    const {id}= req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(404).json({error:'no such workout'})
    }
        
    
     const workout = await WorkoutSchema.findById(id)

     if(!workout){
        return res.status(404).json({error:"no such workout"})
     }
    res.status(200).json(workout)
}


const createWorkout = async(req,res)=>{
    
    const {title,load,reps}=req.body
    let emptyFields=[]

    if(!title){
        emptyFields.push('title')
    }

    if(!load){
        emptyFields.push('load')
    }

    if(!reps){
        emptyFields.push('reps')
    }

    if(emptyFields.length>2){
        return res.status(400).json({error:"please fill all the fields",emptyFields})
    }

    
    try {
        const user_id=req.user
        const workout = await WorkoutSchema.create({title,load,reps,user_id})
        res.status(200).json(workout)
    } catch (error) {
        res.status(500).json({error: "fill the fields correctly"})
    }
}


const deleteWorkout = async (req, res) => {
    const { id } = req.params; 

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Workout not found" });
    }

    // Delete the workout
    const workout = await WorkoutSchema.findOneAndDelete({ _id: id });
    if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json(workout);
};


const updateWorkout = async(req,res)=>{
    const {id}= req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"workout not found"})
    }
    const workout= await WorkoutSchema.findOneAndUpdate({_id:id},{
        ...req.body
    })
    if(!workout){
        return res.status(404).json({error:"work out not found"})
    }
    res.status(200).json(workout)
}


module.exports={createWorkout,getWorkout,getWorkouts,updateWorkout,deleteWorkout}