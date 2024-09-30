# NodeTask

## API Endpoints

### User Authentication & Management Endpoints

1. **User Signup**
   - **Method**: `POST`
   - **URL**: `/api/signup`
   - **Description**: This API allows users to sign up. If the `role` is set to `admin`, the user will have admin privileges. If no role is provided, it defaults to `user`.

2. **User Login**
   - **Method**: `GET`
   - **URL**: `/api/login`
   - **Description**: Logs in the user and provides a JWT token for authorization.

3. **Approve or Manage Users**
   - **Method**: `POST`
   - **URL**: `/api/approveUser`
   - **Headers**: 
     ```text
     Authorization: Bearer <admin_token>
     ```
   - **Description**: Admin can approve, reject, block, or delete users.

4. **Get Pending Users**
   - **Method**: `GET`
   - **URL**: `/api/getPendingUsers`
   - **Headers**: 
     ```text
     Authorization: Bearer <admin_token>
     ```
   - **Description**: Admin can retrieve a list of users whose status is pending for approval.

5. **Get User List**
   - **Method**: `GET`
   - **URL**: `/api/getUserList`
   - **Headers**: 
     ```text
     Authorization: Bearer <admin_token>
     ```
   - **Query Parameters** (Optional):
     - You can filter users by `firstname`, `email`, or `phoneNumber`:
       ```text
       /api/getUserList?firstname=John&email=john@example.com&phonenumber=1234567890
       ```
   - **Description**: Admin can retrieve a list of accepted users. You can also filter users by firstname, email, or phone number.

---

### Product Management Endpoints

1. **Add a Product**
   - **Method**: `POST`
   - **URL**: `/api/addproduct`
   - **Headers**: 
     ```text
     Authorization: Bearer <admin_token>
     ```
   - **Body (JSON)**:
     ```json
     {
       "name": "Product Name",
       "quantity": 100,
       "price": 50.99,
       "warehouseId": "warehouse-id-here"
     }
     ```
   - **Description**: Allows an admin to add a new product to a specific warehouse.

---

### Warehouse Management Endpoints

1. **Add a Warehouse**
   - **Method**: `POST`
   - **URL**: `/api/addwarehouse`
   - **Headers**: 
     ```text
     Authorization: Bearer <admin_token>
     ```
   - **Body (JSON)**:
     ```json
     {
       "name": "Warehouse Name",
       "location": "Warehouse Location"
     }
     ```
   - **Description**: Allows an admin to add a new warehouse/hub with a specific name and location.

---

## Project Setup

### Prerequisites

- Node.js
- MongoDB
- A tool like Postman for testing the API.

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nodetask
