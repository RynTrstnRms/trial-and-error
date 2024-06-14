<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = Doctor::all();
        return response()->json($doctors);
    }

    public function show($id)
    {
        $doctor = Doctor::findOrFail($id);
        return response()->json($doctor);
    }

    public function showEmail($email)
    {
        try {
            $doctor = Doctor::where('email', $email)->firstOrFail();
            return response()->json($doctor);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Doctor not found.'], 404);
        }
    }

    public function store(Request $request)
    {
        Doctor::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'specialization' => $request->specialization,
            'license_number' => $request->license_number,
            'phone' => $request->phone,
            'email' => $request->email,

        ]);

        return response()->json(['message' => 'Doctor added successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->first_name = $request->input('first_name');
        $doctor->last_name = $request->input('last_name');
        $doctor->specialization = $request->input('specialization');
        $doctor->license_number = $request->input('specialization');
        $doctor->phone = $request->input('phone');
        $doctor->email = $request->input('email');
        $doctor->save();

        return response()->json(['message' => 'Doctor updated successfully', 'doctor' => $doctor]);
    }

    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->delete();
        return response()->json(['message' => 'Doctor removed successfully']);
    }
}
