# MongoDB Setup Instructions

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# MongoDB Atlas Connection String
# Get this from your MongoDB Atlas dashboard -> Connect -> Connect your application
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_URI=your_mongodb_connection_string_here

# Optional: Database name (defaults to 'brain-rot-study' if not provided)
MONGODB_DB_NAME=brain-rot-study
```

## How to Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Click "Connect" on your cluster
4. Select "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user's password
7. Replace `<dbname>` if needed (or add it to the connection string)

## Security Notes

- The `.env.local` file is already in `.gitignore` and will NOT be committed to git
- Never commit your MongoDB credentials to version control
- Keep your database user password secure

## Collection Name

The survey responses will be saved to a collection called `surveys` in your specified database.


