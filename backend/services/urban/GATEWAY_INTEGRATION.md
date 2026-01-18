# Urban Complaints Microservice - Gateway Integration Guide

## For Live Presentation: Manual Database Entry

### Step 1: Add Urban Services Department

Open MongoDB Compass or Atlas UI, navigate to your Gateway database's `departments` collection, and insert this document:

```json
{
  "name": "Urban Services",
  "description": "Department of Urban Development and Civic Services",
  "code": "URBAN",
  "endpointBaseUrl": "http://localhost:5003",
  "icon": "building-2",
  "isActive": true
}
```

**Copy the generated `_id` value - you'll need it for the next step!**

---

### Step 2: Add Submit Complaint Service

In the `services` collection, insert this document (replace `<URBAN_DEPARTMENT_ID>` with the _id from Step 1):

```json
{
  "name": "Submit Complaint",
  "description": "Report urban issues like infrastructure problems, sanitation, street lights, etc.",
  "departmentId": ObjectId("<URBAN_DEPARTMENT_ID>"),
  "endpointPath": "/internal/complaints",
  "method": "POST",
  "icon": "alert-circle",
  "isActive": true,
  "formSchema": [
    {
      "name": "state",
      "label": "State",
      "type": "text",
      "required": true,
      "placeholder": "Enter your state"
    },
    {
      "name": "city",
      "label": "City",
      "type": "text",
      "required": true,
      "placeholder": "Enter your city"
    },
    {
      "name": "area",
      "label": "Area/Locality",
      "type": "text",
      "required": true,
      "placeholder": "Enter area or locality"
    },
    {
      "name": "address",
      "label": "Full Address",
      "type": "textarea",
      "required": true,
      "placeholder": "Enter complete address"
    },
    {
      "name": "complaint",
      "label": "Complaint Description",
      "type": "textarea",
      "required": true,
      "placeholder": "Describe the issue in detail"
    }
  ]
}
```

---

### Step 3: (Optional) Add Urban Officer User

In the `users` collection, insert this document for testing:

```json
{
  "email": "officer.urban@nexus.gov",
  "password": "$2a$10$YourHashedPasswordHere",
  "name": "Urban Services Officer",
  "role": "DEPARTMENT_PERSON",
  "departmentId": ObjectId("<URBAN_DEPARTMENT_ID>")
}
```

**Note**: For the password, you can either:
- Use the existing hashed password from another officer account
- Or register this user through the application's registration flow

---

## API Endpoints Reference

### Base URL
```
http://localhost:5003
```

### Public Endpoints

#### Health Check
```
GET /health
```

**Response**:
```json
{
  "status": "UP",
  "service": "Urban Complaints Microservice",
  "timestamp": "2026-01-18T10:30:00.000Z"
}
```

---

### Internal Endpoints (Require Service JWT)

All `/internal/*` endpoints require a valid Service JWT from the Gateway.

#### 1. Process New Complaint
```
POST /internal/complaints
```

**Headers**:
```
Authorization: Bearer <SERVICE_JWT>
X-Citizen-Token: <CITIZEN_JWT>
X-Request-Id: <NEXUS_REQUEST_ID>
X-Citizen-Id: <CITIZEN_ID>
```

**Request Body**:
```json
{
  "requestId": "65abc123def456...",
  "serviceId": "65xyz789...",
  "serviceName": "Submit Complaint",
  "citizenId": "65citizen123...",
  "citizenName": "John Doe",
  "citizenEmail": "john@example.com",
  "data": {
    "state": "Gujarat",
    "city": "Ahmedabad",
    "area": "Satellite",
    "address": "123 Main Street, Near City Mall",
    "complaint": "Street light not working for past 2 weeks"
  }
}
```

**Response**:
```json
{
  "success": true,
  "status": "PENDING",
  "remarks": "Your complaint has been received and is pending review by our urban services team.",
  "responseData": {
    "complaintId": "65complaint123...",
    "state": "Gujarat",
    "city": "Ahmedabad",
    "area": "Satellite",
    "status": "PENDING"
  }
}
```

---

#### 2. Update Complaint Status
```
POST /internal/update-status
```

**Request Body**:
```json
{
  "requestId": "65abc123def456...",
  "status": "IN_PROGRESS",
  "remarks": "Complaint assigned to maintenance team. Work will begin tomorrow.",
  "processedBy": "officer.urban@nexus.gov"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Complaint status updated.",
  "data": {
    "_id": "65complaint123...",
    "nexusRequestId": "65abc123def456...",
    "citizenId": "65citizen123...",
    "state": "Gujarat",
    "city": "Ahmedabad",
    "status": "IN_PROGRESS",
    "remarks": "Complaint assigned to maintenance team...",
    "processedBy": "officer.urban@nexus.gov",
    "processedAt": "2026-01-18T10:35:00.000Z"
  }
}
```

---

#### 3. Get Citizen's Complaints
```
GET /internal/complaints/citizen?citizenId=<CITIZEN_ID>
```

Or with header:
```
GET /internal/complaints/citizen
X-Citizen-Id: <CITIZEN_ID>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65complaint123...",
      "state": "Gujarat",
      "city": "Ahmedabad",
      "area": "Satellite",
      "complaint": "Street light not working...",
      "status": "IN_PROGRESS",
      "createdAt": "2026-01-18T09:00:00.000Z"
    }
  ]
}
```

---

#### 4. Get All Complaints
```
GET /internal/complaints?status=PENDING&limit=50
```

**Query Parameters**:
- `status` (optional): Filter by status (PENDING, IN_PROGRESS, COMPLETED)
- `limit` (optional): Max results (default: 50)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65complaint123...",
      "citizenName": "John Doe",
      "state": "Gujarat",
      "city": "Ahmedabad",
      "complaint": "Street light not working...",
      "status": "PENDING",
      "createdAt": "2026-01-18T09:00:00.000Z"
    }
  ]
}
```

---

#### 5. Get Complaint by ID
```
GET /internal/complaints/:id
```

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "65complaint123...",
    "nexusRequestId": "65abc123def456...",
    "citizenId": "65citizen123...",
    "citizenName": "John Doe",
    "citizenEmail": "john@example.com",
    "state": "Gujarat",
    "city": "Ahmedabad",
    "area": "Satellite",
    "address": "123 Main Street, Near City Mall",
    "complaint": "Street light not working for past 2 weeks",
    "status": "IN_PROGRESS",
    "remarks": "Complaint assigned to maintenance team...",
    "processedBy": "officer.urban@nexus.gov",
    "processedAt": "2026-01-18T10:35:00.000Z",
    "createdAt": "2026-01-18T09:00:00.000Z",
    "updatedAt": "2026-01-18T10:35:00.000Z"
  }
}
```

---

## Environment Setup

Create a `.env` file in `backend/services/urban/` with:

```env
PORT=5003
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus_urban?retryWrites=true&w=majority
SERVICE_JWT_SECRET=same_secret_as_gateway_and_other_services
```

**CRITICAL**: The `SERVICE_JWT_SECRET` must be identical across:
- Gateway (`backend/.env`)
- Healthcare service (`backend/services/healthcare/.env`)
- Agriculture service (`backend/services/agriculture/.env`)
- Urban service (`backend/services/urban/.env`)

---

## Running the Microservice

```bash
# Install dependencies
cd backend/services/urban
npm install

# Start the service
npm run dev
```

Expected output:
```
🗄️  Urban DB Connected: cluster0-shard-00-00.mongodb.net
🏙️  Urban Complaints Microservice running at http://localhost:5003
   Internal endpoints: /internal/*
   Health check: /health
```

---

## Testing the Service

### 1. Test Health Check
```bash
curl http://localhost:5003/health
```

### 2. Test JWT Protection (Should Fail)
```bash
curl -X POST http://localhost:5003/internal/complaints \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

Expected: `401 Unauthorized` or `403 Forbidden`

### 3. Test Complete Flow
- Start all services (Gateway, Healthcare, Agriculture, Urban, Frontend)
- Login as citizen
- Navigate to Urban Services department
- Submit a complaint with all fields
- Verify complaint appears in both Gateway and Urban databases
