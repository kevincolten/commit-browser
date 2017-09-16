import React from 'react';
import debounce from 'lodash.debounce';

const headers = {
  'Authorization': `Basic ${btoa('kevincolten:e14c5a32211126ea2fb991585c98d7e6fcd61c03')}`,
  'User-Agent': 'kevincolten'
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      repos: [],
      commits: []
    }
    this.searchUsers = this.searchUsers.bind(this);
    this.clickUser = this.clickUser.bind(this);
    this.clickRepo = this.clickRepo.bind(this);
    this.clickCommit = this.clickCommit.bind(this);
  }

  searchUsers(e) {
    fetch(`https://api.github.com/search/users?q=${this.userInput.value}`, { headers })
    .then(res => res.json())
    .then(json => this.setState({ users: json.items }))
    .catch(e => console.error(e));
  }

  fetchRepos(user) {
    fetch(`https://api.github.com/users/${user}/repos?sort=updated`, { headers })
    .then(res => res.json())
    .then(repos => this.setState({ 
      repos: repos.sort((a, b) => a.forks_count < b.forks_count ? 1 : -1)
    }))
    .catch(e => console.error(e));
  }

  fetchCommits(repo) {
    fetch(`https://api.github.com/repos/${repo}/commits`, { headers })
    .then(res => res.json())
    .then(commits => this.setState({ commits }))
    .catch(e => console.error(e));
  }

  clickUser(e) {
    e.preventDefault();
    this.fetchRepos(e.target.getAttribute('href'));
  }

  clickRepo(e) {
    e.preventDefault();
    this.fetchCommits(e.target.getAttribute('href'));
  }

  clickCommit(e) {
    e.preventDefault();
  }

  users() {
    return this.state.users.map(user => {
      return <li key={user.id}><a href={user.login}>{user.login}</a></li>
    })
  }

  repos() {
    return this.state.repos.map(repo => {
      return <li key={repo.id}><a href={`${repo.owner.login}/${repo.name}`}>{repo.name}</a></li>
    })
  }

  commits() {
    return this.state.commits.map(commit => {
      return <li key={commit.sha}><a href={commit.sha}>{commit.commit.message}</a></li>
    })
  }

  render() {
    return (
      <div>
        <label>Search for a User or Organization
          <br />
          <input onChange={debounce(this.searchUsers, 500)} ref={(input) => this.userInput = input} />
          <ul onClick={this.clickUser}>{this.users()}</ul>
        </label>
        <p>Repositories</p>
        <ul onClick={this.clickRepo}>{this.repos()}</ul>
        <p>Commits</p>
        <ul onClick={this.clickCommit}>{this.commits()}</ul>
      </div>
    );
  }
}

export default App;
