<?php

namespace App\Http\Controllers;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|in:get',
                'offset' => 'integer|min:0',
                'paginate' => 'integer|min:1',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'status' => 1,
                    'message' => $validator->errors()
                ], 400);
            }
            $data = $validator->validated();
            $offset = $data['offset'] ?? 0;
            $paginate = $data['paginate'] ?? 12;
            $members = Member::offset($offset)->paginate($paginate);
            return response()->json([
                'status' => 0,
                'data' => $members,
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'status' => 1,
                'message' => $th->getMessage()
            ], 400);
        }
    }

    public function BodyData($json){
        try {
            $arr = [];
            $data = json_decode($json, true);
            $role = $data["role"] ?? "";
            $action = $data["action"] ?? "";
            $member_id = $arr["id"] = $data["member_id"] ?? "";
            $member_name = $arr["name"] = $data["member_name"]?? "";
            $member_email = $arr["email"] = $data["member_email"]??"";
            $member_phone = $arr["phone"] = $data["member_phone"]??"";
            $member_address = $arr["address"] = $data["member_address"]??"";
            $member_role = $arr["role"] = $data["member_role"]??"";
            $member_description = $arr["description"] = $data["member_description"]??"";
            return $arr;
        } catch (\Throwable $th) {
            //throw $th;
            return $arr;
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(){
       
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // try {
        //     $body = $request->json()->all();
        //     $data = $this->BodyData($body);
        //     if($data["action"] !== "adđ"){
        //         return response(json_encode([
        //             "status" => 0,
        //             "message" => "Invalid action"
        //         ]), 400);
        //     }
        //     $add_data = [
        //         "name" => $data["member_name"],
        //         "email" => $data["member_email"],
        //         "phone" => $data["member_phone"],
        //         "address" => $data["member_address"],
        //         "role" => $data["member_role"],
        //         "description" => $data["member_description"],
        //     ];
        //     Member::create($add_data);
        //     return response(json_encode([
        //         "status" => 0,
        //         "message" => "Member created successfully"
        //     ]), 200);
        // } catch (\Throwable $th) {
        //     //throw $th;
        //     return response(json_encode([
        //         "status" => 1,
        //         "message" => $th->getMessage()
        //     ], 400));
        // }
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:add',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            'image' => 'nullable|string',
            'address' => 'required|string|max:255',
            'role' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }

        $data = $validator->validated();
        Member::create($data);
        return response()->json([
            'status' => 0,
            'message' => 'Member created successfully'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        // try {
        //     $body = $request->json()->all();
        //     $data = $this->BodyData($body);
        //     if($data["action"] !== "edit"){
        //         return response(json_encode([
        //             "status" => 1,
        //             "message" => "Invalid action"
        //         ]), 400);
        //     }
        //     $edit_data = [
        //         "id" => $data["member_id"],
        //         "name" => $data["member_name"],
        //         "email" => $data["member_email"],
        //         "phone" => $data["member_phone"],
        //         "address" => $data["member_address"],
        //         "role" => $data["member_role"],
        //         "description" => $data["member_description"],
        //     ];
        //     Member::update($edit_data);
        //     return response(json_encode([
        //         "status" => 0,
        //         "message" => "Member updated successfully"
        //     ]), 200);
        // } catch (\Throwable $th) {
        //     //throw $th;
        //     return response(json_encode([
        //         "status" => 1,
        //         "message" => $th->getMessage()
        //     ]), 400);
        // }
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:edit',
            'id' => 'required|exists:members,id',
            'name' => 'string|max:255',
            'email' => 'email|max:255',
            'image' => 'nullable|string',
            'phone' => 'string|max:15',
            'address' => 'string|max:255',
            'role' => 'string|max:50',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }

        $data = $validator->validated();
        $member = Member::findOrFail($data['id']);
        $member->update($data);

        return response()->json([
            'status' => 0,
            'message' => 'Member updated successfully'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
       
    }

    public function delete(Request $request){
         // try {
        //     $body = $request->json()->all();
        //     $data = $this->BodyData($body);
        //     if($data["action"] !== "delete"){
        //         return response(json_encode([
        //             "status" => 1,
        //             "message" => "Invalid action"
        //         ]), 400);
        //     }
        //     Member::where("id", $data["member_id"])->delete();
        //     return response(json_encode([
        //         "status" => 0,
        //         "message" => "Member deleted successfully"
        //     ]), 200);
        // } catch (\Throwable $th) {
        //     //throw $th;
        //     return response(json_encode([
        //         "status" => 1,
        //         "message" => $th->getMessage()
        //     ]), 400);
        // }
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:delete',
            'id' => 'required|exists:members,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 1,
                'message' => $validator->errors()
            ], 400);
        }

        $data = $validator->validated();
        Member::destroy($data['id']);

        return response()->json([
            'status' => 0,
            'message' => 'Member deleted successfully'
        ], 200);
    }
}