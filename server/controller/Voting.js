import { Voting } from "../models/Voting.js";


export const addvoting = async (req, res) => {
    try {
      const { title, department, startDate, endDate, candidates } = req.body;
  
      if (!title || !department || !startDate || !endDate || !candidates) {
        return res.status(400).json({ 
          success: false,
          message: 'Please provide all required fields' 
        });
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
  
   
      const election = new Voting({
        title,
        department,
        startDate: start,
        endDate: end,
        candidates: candidates.map(name => ({ name: name.trim() }))
      });

      const savedElection = await election.save();
  
      res.status(201).json({
        success: true,
        message: 'Voting created successfully',
        data: savedElection
      });
  
    } catch (error) {
      console.error('Error creating Voting:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating Voting',
        error: error.message
      });
    }
  }
  

  export const getvotings = async (req, res) => {
    try {
    
      const elections = await Voting.find();
  
      res.status(200).json({
        success: true,
        message: "Elections retrieved successfully",
        data: elections,
      });
    } catch (error) {
      console.error("Error fetching elections:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching elections",
        error: error.message,
      });
    }
  };


  export const voteForNominee = async (req, res) => {
    try {
        const { electionId, nomineeId, userId } = req.body;

        if (!electionId || !nomineeId || !userId) {
            return res.status(400).json({ success: false, message: 'Election ID, Nominee ID, and User ID are required' });
        }

        const election = await Voting.findById(electionId);
        if (!election) {
            return res.status(404).json({ success: false, message: 'Election not found' });
        }

       
        if (election.votedBy.includes(userId)) {
            return res.status(403).json({ success: false, message: 'You have already voted in this election' });
        }

        const nominee = election.candidates.find(candidate => candidate._id.toString() === nomineeId);
        if (!nominee) {
            return res.status(404).json({ success: false, message: 'Nominee not found' });
        }

      
        nominee.votes = (nominee.votes || 0) + 1;

        election.votedBy.push(userId);

        await election.save();
        res.status(200).json({ success: true, message: 'Vote registered successfully' });
    } catch (error) {
        console.error("Error submitting vote:", error);
        res.status(500).json({ success: false, message: 'Error submitting vote', error: error.message });
    }
};



export const deleteVoting = async (req, res) => {
  console.log('Delete request received for ID:', req.params.id); // Debug log
  
  try {
    const { id } = req.params;
    
    console.log('Checking election existence...'); // Debug log
    
    // Basic validation
    if (!id) {
      console.log('No ID provided'); // Debug log
      return res.status(400).json({
        success: false,
        message: 'Election ID is required'
      });
    }

    // Find and delete in one step
    const result = await Voting.findByIdAndDelete(id);
    console.log('Delete operation result:', result); // Debug log

    if (!result) {
      console.log('Election not found'); // Debug log
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    console.log('Election deleted successfully'); // Debug log
    return res.status(200).json({
      success: true,
      message: 'Election deleted successfully'
    });

  } catch (error) {
    console.error('Server error during deletion:', error); // Debug log
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting election',
      error: error.message
    });
  }
};
