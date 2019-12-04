// Packages
const path = require('path');
const { execSync } = require('child_process');

// Parameters
const NUMBER_MONTHS = 2; // Change this to however many months you want
const destDirectory = path.join(__dirname, '..', 'repoName');

// Vars
const removalDate = new Date().setMonth(new Date().getMonth() - NUMBER_MONTHS);
const gitCommand = "for branch in \`git branch -r | grep -v HEAD\`;do echo -e \`git show --format=\"%ai  |%an|\" $branch | head -n 1\` \\t$branch; done | sort -r";
const res = execSync(gitCommand, { cwd: destDirectory }).toString();
const branches = res.split('\n');

for (var x = 0; x < branches.length; x++) {
    const branch = branches[x];
    let branchDateString = branch.substring(2, 13);
    const author = branch.split("|")[1];
    let branchName = branch.split("|")[2];
    if (!branchDateString) {
        return;
    }
    const branchDate = new Date(branchDateString);
    if (branchName !== undefined) {
        branchName = branchName.substr(2);
    }
    if (!!!branchName || branchDate.toISOString() === null) {
        return;
    }
    if (removalDate < branchDate) {
        console.log("KEEP " + branchDate + " AUTHOR: " + author + " " + branchName.substr(7));
    } else {
        const cmd = "git push origin --delete " + branchName.substr(7);
        execSync(cmd, { cwd: destDirectory });
        console.log("DELETE " + branchDate + " AUTHOR: " + author + " " + branchName.substr(7));
    }
}