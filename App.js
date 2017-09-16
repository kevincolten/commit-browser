import React from 'react';
import debounce from 'lodash.debounce';
import  moment from 'moment';
import "./App.css";

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
    this.searchRepos = this.searchRepos.bind(this);
    this.searchCommits = this.searchCommits.bind(this);
    this.clickUser = this.clickUser.bind(this);
    this.clickRepo = this.clickRepo.bind(this);
    this.clickCommit = this.clickCommit.bind(this);
  }

  searchUsers(e) {
    fetch(`https://api.github.com/search/users?q=${this.userInput.value}`, { headers })
    .then(res => res.json())
    .then(json => this.setState({ users: json.items }))
    .catch(e => {
      console.error(e);
      this.setState({ users: [] });
    });
  }

  searchRepos(e) {
    fetch(`https://api.github.com/search/repositories?q=user:${this.userInput.value}+${this.repoInput.value}`, { headers })
    .then(res => res.json())
    .then(json => this.setState({ repos: json.items }))
    .catch(e => {
      console.error(e);
      this.setState({ repos: [] });
    });
      
  }

  searchCommits(e) {
    if (this.commitInput.value) {
      fetch(`https://api.github.com/search/commits?q=repo:${this.userInput.value}/${this.repoInput.value}+${this.commitInput.value}`, { 
        headers: Object.assign(headers, { 
          'Accept': 'application/vnd.github.cloak-preview' 
        })
      })
      .then(res => res.json())
      .then(json => this.setState({ commits: json.items }))
      .catch(e => {
        console.error(e);
        this.setState({ commits: [] });
      });
    } else {
      this.fetchCommits(this.repoInput.value);
    }
  }

  fetchRepos(user) {
    fetch(`https://api.github.com/users/${user}/repos?sort=updated`, { headers })
    .then(res => res.json())
    .then(repos => this.setState({ 
      repos: repos.sort((a, b) => a.forks_count < b.forks_count ? 1 : -1)
    }))
    .catch(e => {
      console.error(e);
      this.setState({ repos: [] });
    });
  }

  fetchCommits(repo) {
    fetch(`https://api.github.com/repos/${this.userInput.value}/${repo}/commits`, { headers })
    .then(res => res.json())
    .then(commits => this.setState({ commits }))
    .catch(e => {
      console.error(e);
      this.setState({ commits: [] });
    });
  }

  clickUser(e) {
    this.userInput.value = e.target.closest('[data-user]').getAttribute('data-user');
    this.fetchRepos(this.userInput.value);
  }

  clickRepo(e) {
    this.repoInput.value = e.target.closest('[data-repo]').getAttribute('data-repo');
    this.fetchCommits(this.repoInput.value);
  }

  clickCommit(e) {
    const a = document.createElement('a');
    a.href = e.target.closest('[data-url]').getAttribute('data-url');
    a.setAttribute('target', '_blank');
    a.click();
  }

  users() {
    return this.state.users.map(user => {
      return (
        <tr key={user.id} data-user={user.login} style={{ cursor: 'pointer' }}>
          <td style={{display: 'flex', alignContent: 'center'}}>
            <img src={user.avatar_url} />
            <div style={{ marginLeft: '2px' }}>
              {user.login}
              <br />
              <small>{user.type}</small>
            </div>
          </td>
        </tr>
      );
    })
  }

  repos() {
    return this.state.repos.map(repo => {
      return (
        <tr key={repo.id} data-repo={repo.name} style={{ cursor: 'pointer' }}>
          <td>
            {repo.name}
            <br />
            <small>
              forks: {repo.forks_count}&nbsp;&nbsp;stars: {repo.stargazers_count}
            </small>
          </td>
        </tr>
      );
    });
  }

  commits() {
    return this.state.commits.map(commit => {
      return (
        <tr key={commit.sha} data-url={commit.html_url} style={{ cursor: 'pointer' }}>
          <td>
            <div className="nowrap">{commit.commit.message}</div>
            <small>
              {commit.sha.slice(-7)}&nbsp;&nbsp;{commit.commit.author.name}&nbsp;&nbsp;{moment.utc(commit.commit.author.date).fromNow()}
            </small>
          </td>
        </tr>
      );
    });
  }

  render() {
    const repoSearchVisibility = (this.userInput && this.userInput.value) ? 'visible' : 'hidden';
    const commitSearchVisibility = (this.repoInput && this.repoInput.value) ? 'visible' : 'hidden';
    return (
      <div>
        <h1 className="text-center">Commit Browser</h1>
        <div id="tables">
          <table>
            <caption>
              <input 
                placeholder="Search Users/Orgs" 
                onChange={debounce(this.searchUsers, 500)} 
                ref={(input) => this.userInput = input} 
              />
            </caption>
            <thead>
              <tr>
                <th>Users / Organizations</th>
              </tr>
            </thead>
            <tbody onClick={this.clickUser}>{this.users()}</tbody>
          </table>
          <table>
            <caption>
              <input 
                placeholder="Search Repos" 
                onChange={debounce(this.searchRepos, 500)} 
                ref={(input) => this.repoInput = input}
                style={{ visibility: repoSearchVisibility }}
              />
            </caption>
            <thead>
              <tr>
                <th>Repositories</th>
              </tr>
            </thead>
            <tbody onClick={this.clickRepo}>{this.repos()}</tbody>
          </table>
          <table>
            <caption>
              <input 
                placeholder="Search Commits" 
                onChange={debounce(this.searchCommits, 500)} 
                ref={(input) => this.commitInput = input}
                style={{ visibility: commitSearchVisibility }}
              />
            </caption>
            <thead>
              <tr>
                <th>Commits</th>
              </tr>
            </thead>
            <tbody onClick={this.clickCommit}>{this.commits()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
