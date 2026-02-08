const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) {
  const { owner, name, issues = [], content = [], description, visibility = true } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    // Optional: link to user's repositories
    await User.findByIdAndUpdate(owner, { $push: { repositories: result._id } });

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation:", err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoriesByUser(req, res) {
  const { userId } = req.params;
  try {
    const repositories = await Repository.find({ owner: userId })
      .populate("owner")
      .populate("issues");

    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ message: "No repositories found for this user" });
    }

    res.json(repositories);
  } catch (err) {
    console.error("Error fetching user repositories:", err.message);
    res.status(500).send("Server error");
  }
}



async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID).populate("starRepos"); 
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json(user.starRepos); // full repository objects
  } catch (err) {
    console.error("Error fetching starred repos:", err.message);
    res.status(500).send("Server error");
  }
}


async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server error");
  }
}

async function addStarRepo(req, res) {
  const { repoId } = req.params; // this comes from URL :repoId
  const { userId } = req.body;   // this comes from frontend body

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
      return res.status(400).json({ error: "Invalid Repository ID!" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found!" });

    const repo = await Repository.findById(repoId);  // ✅ your Repository model
    if (!repo) return res.status(404).json({ error: "Repository not found!" });

    // ⭐ only star (no unstar toggle)
    if (!user.starRepos.includes(repoId)) {
      user.starRepos.push(repoId);
      await user.save();
      return res.json({ message: "Repository starred successfully!" });
    }

    return res.json({ message: "Repository already starred!" });
  } catch (err) {
    console.error("Error during starring repository:", err.message);
    res.status(500).send("Server error");
  }
}


async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoriesByUser,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  addStarRepo,
  deleteRepositoryById,
};