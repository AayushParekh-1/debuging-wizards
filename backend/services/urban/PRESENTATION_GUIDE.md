# Urban Complaints Microservice - Quick Reference for Presentation

## 🎯 What Was Built

A complete **Urban Complaints Microservice** for the Nexus platform that allows citizens to report urban issues like infrastructure problems, sanitation, street lights, etc.

### Key Features
- ✅ Independent microservice on **port 5003**
- ✅ Separate MongoDB database
- ✅ Service JWT authentication
- ✅ Complete CRUD operations
- ✅ Status tracking: PENDING → IN_PROGRESS → COMPLETED
- ✅ Follows exact same architecture as Healthcare & Agriculture services

---

## 📋 Form Schema (For Manual Entry)

When demonstrating to judges, you'll manually add this service to the Gateway database. Here's the **form schema** to copy-paste:

### Department (Add to `departments` collection):
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

### Service (Add to `services` collection):
```json
{
  "name": "Submit Complaint",
  "description": "Report urban issues like infrastructure problems, sanitation, street lights, etc.",
  "departmentId": ObjectId("<PASTE_URBAN_DEPARTMENT_ID_HERE>"),
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

## 🚀 API Endpoints

### Public Endpoint
- **Health Check**: `GET http://localhost:5003/health`

### Internal Endpoints (Protected by Service JWT)
All require Gateway authentication:

1. **Submit Complaint**: `POST /internal/complaints`
2. **Update Status**: `POST /internal/update-status`
3. **Get Citizen Complaints**: `GET /internal/complaints/citizen`
4. **Get All Complaints**: `GET /internal/complaints`
5. **Get Complaint by ID**: `GET /internal/complaints/:id`

---

## 🎬 Demo Flow for Judges

### Step 1: Start All Services
```bash
# Terminal 1: Gateway
cd backend && npm run dev

# Terminal 2: Healthcare
cd backend/services/healthcare && npm run dev

# Terminal 3: Agriculture
cd backend/services/agriculture && npm run dev

# Terminal 4: Urban (NEW!)
cd backend/services/urban && npm run dev

# Terminal 5: Frontend
cd frontend && npm run dev
```

### Step 2: Register Service (Live Demo)
1. Open MongoDB Compass/Atlas
2. Navigate to Gateway database
3. Add Urban Services department (copy from above)
4. Copy the generated `_id`
5. Add Submit Complaint service (paste the `_id` in `departmentId`)

### Step 3: Test Complete Flow
1. **Login** as citizen in frontend
2. **Navigate** to Urban Services department (should appear dynamically!)
3. **Fill form**:
   - State: Gujarat
   - City: Ahmedabad
   - Area: Satellite
   - Address: 123 Main Street
   - Complaint: Street light not working for 2 weeks
4. **Submit** and show request created
5. **Verify** in databases:
   - Gateway DB: Check `requests` collection
   - Urban DB: Check `complaints` collection
6. **Show** how officer can update status

---

## 💡 Key Points to Highlight

### Architecture Consistency
- "Notice how the Urban microservice follows the **exact same pattern** as Healthcare and Agriculture"
- "This demonstrates the **scalability** of our architecture - adding new departments is straightforward"

### Dynamic Form Rendering
- "The form you see is **dynamically generated** from the `formSchema` we just added to the database"
- "No frontend code changes needed - just add the service definition"

### Security
- "All microservices are **protected by Service JWT**"
- "Citizens cannot access microservices directly - everything goes through the Gateway"
- "Each microservice has its **own isolated database**"

### Real-World Application
- "This complaint system can handle **any urban issue**: potholes, garbage collection, water supply, electricity, etc."
- "Status tracking allows citizens to **monitor progress** in real-time"
- "Department officers can **prioritize and manage** complaints efficiently"

---

## 📊 Database Schema

### Complaint Model Fields
```javascript
{
  nexusRequestId: String,      // Links to Gateway request
  citizenId: String,           // Who submitted
  citizenName: String,
  citizenEmail: String,
  state: String,               // Location fields
  city: String,
  area: String,
  address: String,
  complaint: String,           // Issue description
  status: String,              // PENDING | IN_PROGRESS | COMPLETED
  remarks: String,             // Officer notes
  processedBy: String,         // Officer who handled it
  processedAt: Date,
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-generated
}
```

---

## 🔧 Environment Setup

Create `backend/services/urban/.env`:
```env
PORT=5003
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus_urban
SERVICE_JWT_SECRET=<SAME_AS_OTHER_SERVICES>
```

**CRITICAL**: `SERVICE_JWT_SECRET` must match across all services!

---

## ✅ What Makes This Impressive

1. **Microservices Architecture**: Truly independent service with own database
2. **Dynamic Service Registry**: No hardcoding - services registered in database
3. **Zero-Trust Security**: Service-to-service JWT authentication
4. **Scalability**: Easy to add more departments/services
5. **Real-World Use Case**: Solves actual civic problems
6. **Complete Implementation**: Not a mock - fully functional with database persistence

---

## 📁 File Structure

```
backend/services/urban/
├── index.js                          # Express server entry point
├── package.json                      # Dependencies
├── .env.sample                       # Environment template
├── GATEWAY_INTEGRATION.md            # Detailed integration guide
├── src/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── models/
│   │   └── Complaint.model.js        # Mongoose schema
│   ├── controllers/
│   │   └── complaint.controller.js   # Business logic
│   ├── middlewares/
│   │   └── verifyServiceJwt.middleware.js  # JWT verification
│   └── routes/
│       └── internal.routes.js        # API endpoints
```

---

## 🎓 Talking Points

**"Why is this architecture superior?"**
- Microservices can be deployed independently
- Failure in one service doesn't affect others
- Each department can scale based on demand
- Different teams can work on different services
- Technology stack can vary per service if needed

**"How does it integrate with existing system?"**
- Uses same Gateway authentication
- Follows same request lifecycle
- Same JWT security model
- Same database patterns
- Frontend automatically adapts to new services

**"What's next?"**
- Add more urban services (building permits, tax payments, etc.)
- Implement officer assignment logic
- Add email/SMS notifications
- Create analytics dashboard
- Mobile app integration

---

## 🎯 Success Metrics

- ✅ Microservice runs independently on port 5003
- ✅ Health check responds correctly
- ✅ JWT protection works (unauthorized requests fail)
- ✅ Database connection successful
- ✅ Complete request flow works end-to-end
- ✅ Data persists in both Gateway and Urban databases
- ✅ Status updates reflect in real-time
- ✅ Frontend dynamically renders the new service

---

**Good luck with your presentation! 🚀**
