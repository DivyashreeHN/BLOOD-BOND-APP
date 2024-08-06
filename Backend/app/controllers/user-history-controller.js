const Response = require('../models/responseModel');
const BloodRequest = require('../models/bloodRequest-model');
const userResponseHistory = {};

userResponseHistory.historyOfUser = async (req, res) => {
    const userId = req.params.id; // Extract user ID from URL parameter
    try {
        const myResponses = await Response.find({ responderId: userId }).lean();

        if (myResponses.length === 0) {
            return res.status(200).json([]);
        }

        // Extracting bloodRequestIds from each response
        const bloodRequestIds = myResponses.map(response => response.bloodRequestId);

        // Fetching bloodRequest details for each bloodRequestId
        const bloodRequests = await BloodRequest.find({ _id: { $in: bloodRequestIds } }).lean();

        // Prepare response to send to frontend
        const responseDetails = myResponses.map(response => ({
            responseId: response._id, // Assuming you want to include response ID
            bloodRequest: bloodRequests.find(br => br._id.toString() === response.bloodRequestId.toString())
        }));

        return res.status(200).json(responseDetails);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

userResponseHistory.deleteAndUpdatedResponse = async (req, res) => {
    try {
        const { responderId, bloodRequestId } = req.params;
        const userId = req.user.id; // Assuming you have middleware to extract user ID from token

        // Check if the response belongs to the authenticated user's profile
        const userResponse = await Response.findOneAndDelete({ responderId, bloodRequestId });

        if (!userResponse) {
            return res.status(404).json({ msg: 'Response not found or unauthorized' });
        }

        // Fetch the updated list of responses for the user
        const updatedResponses = await Response.find({ responderId });

        res.json({ msg: 'Response deleted successfully', updatedResponses });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
    
    

module.exports = userResponseHistory;
