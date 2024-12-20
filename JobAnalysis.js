class Job {
    constructor({ Title, Posted, Type, Level, Skill, Detail }) {
        this.title = Title;
        this.posted = this.parsePostedTime(Posted);
        this.type = Type;
        this.level = Level;
        this.skill = Skill;
        this.detail = Detail;
        this.rawPosted = Posted;
    }

    parsePostedTime(posted) {
        const match = posted.match(/(\d+)\s(\w+)/);
        if (match) {
            const value = parseInt(match[1]);
            const unit = match[2];
            if (unit.includes("minute")) return value;
            if (unit.includes("hour")) return value * 60;
        }
        return 0;
    }
}

// Global job list
let jobList = [];

// Load and parse JSON data
document.getElementById('fileUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            jobList = data.map(job => new Job(job));
            displayJobs(jobList);
            populateFilters(jobList);
        } catch (e) {
            alert("Invalid JSON file");
        }
    };

    reader.readAsText(file);
});

// Populate filters dynamically
function populateFilters(jobs) {
    const levels = new Set(jobs.map(job => job.level));
    const levelFilter = document.getElementById('levelFilter');
    levelFilter.innerHTML = `<option value="">All Levels</option>`;
    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        levelFilter.appendChild(option);
    });

    const types = new Set(jobs.map(job => job.type));
    const typeFilter = document.getElementById('typeFilter');
    typeFilter.innerHTML = `<option value="">All Types</option>`;
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });

    const skills = new Set(jobs.map(job => job.skill));
    const skillFilter = document.getElementById('skillFilter');
    skillFilter.innerHTML = `<option value="">All Skills</option>`;
    skills.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        skillFilter.appendChild(option);
    });
}

// Display jobs
function displayJobs(jobs) {
    const container = document.getElementById('jobListings');
    container.innerHTML = '';
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.textContent = job.title;
        jobCard.addEventListener('click', () => {
            showJobDetails(job);
        });
        container.appendChild(jobCard);
    });
}

// Show modal with job details
function showJobDetails(job) {
    const modal = document.getElementById('jobModal');
    const overlay = document.getElementById('overlay');

    document.getElementById('modalTitle').textContent = job.title;
    document.getElementById('modalType').textContent = job.type;
    document.getElementById('modalLevel').textContent = job.level;
    document.getElementById('modalSkill').textContent = job.skill;
    document.getElementById('modalDetail').textContent = job.detail;
    document.getElementById('modalPosted').textContent = job.rawPosted;

    modal.style.display = 'block';
    overlay.style.display = 'block';
}

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('jobModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// Filter jobs based on criteria
function filterJobs(jobs) {
    const level = document.getElementById('levelFilter').value;
    const type = document.getElementById('typeFilter').value;
    const skill = document.getElementById('skillFilter').value;

    return jobs.filter(job =>
        (!level || job.level === level) &&
        (!type || job.type === type) &&
        (!skill || job.skill === skill)
    );
}

// Sort jobs
function sortJobs(jobs, sortBy) {
    if (sortBy === 'title-asc') {
        return jobs.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'title-desc') {
        return jobs.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sortBy === 'posted-latest') {
        return jobs.sort((a, b) => b.posted - a.posted);
    }
    if (sortBy === 'posted-earliest') {
        return jobs.sort((a, b) => a.posted - b.posted);
    }
    return jobs;
}

// Apply filters and sorting
document.getElementById('applyFilters').addEventListener('click', () => {
    const filteredJobs = filterJobs(jobList);
    const sortBy = document.getElementById('sortOptions').value;
    const sortedJobs = sortJobs(filteredJobs, sortBy);
    displayJobs(sortedJobs);
});