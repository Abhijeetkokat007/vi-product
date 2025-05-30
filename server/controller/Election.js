import Election from "./../models/Election.js";

export const addele = async (req, res) => {
    const { title, description, nominationPeriod, campaignPeriod, votingPeriod, resultDeclaration } = req.body;
  
    if (!title || !description || !nominationPeriod || !campaignPeriod || !votingPeriod || !resultDeclaration) {
      return res.status(400).json({ error: "All fields are required!" });
    }
  
    try {
   
      const newElection = new Election({
        title,
        description,
        nominationPeriod,
        campaignPeriod,
        votingPeriod,
        resultDeclaration,
      });
  
   
      const savedElection = await newElection.save();
  
      res.status(201).json({
        message: "Election created successfully!",
        election: savedElection,
      });
    } catch (err) {
      console.error("Error saving election:", err);
      res.status(500).json({ error: "Failed to create election" });
    }
  }


  export const getele = async (req, res) => {
    try {
      const elections = await Election.find(); // Retrieve all election documents
      res.status(200).json(elections);
    } catch (error) {
      console.error("Error fetching elections:", error);
      res.status(500).json({ error: "Failed to retrieve elections" });
    }
  }

  export const deletelection = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedElection = await Election.findByIdAndDelete(id); 
  
      if (!deletedElection) {
        return res.status(404).json({ message: "Election not found" });
      }
  
      res.status(200).json({ message: "Election deleted successfully", election: deletedElection });
    } catch (error) {
      console.error("Error deleting election:", error);
      res.status(500).json({ error: "Failed to delete election" });
    }
  }