workflow "Deploy to Github Pages" {
  on = "push"
  resolves = ["deploy to github pages"]
}

action "lektor build" {
  uses = "docker://softinstigate/lektor:3.1.2"
  args = "build"
}

action "only on master" {
  uses = "actions/bin/filter@b2bea07"
  needs = ["lektor build"]
  args = "branch master"
}

action "deploy to github pages" {
  uses = "docker://softinstigate/lektor"
  needs = ["only on master"]
  args = "deploy ghpages --username $GITHUB_TOKEN"
  secrets = ["GITHUB_TOKEN"]
}
