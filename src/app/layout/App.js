import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import EventDashboard from "../../features/event/EventDashboard/EventDashboard";
import NavBar from "../../features/nav/NavBar/NavBar";
import {Container} from "semantic-ui-react";

// Components
import EventDetailedPage from "../../features/event/EventDetailed/EventDetailedPage";
import PeopleDashboard from "../../features/user/PeopleDashboard/PeopleDashboard";
import UserDetailed from "../../features/user/UserDetailed/UserDetailed";
import SettingsDashboard from "../../features/user/Settings/SettingsDashboard";
import EventForm from "../../features/event/EventForm/EventForm";
import HomePage from "../../features/home/HomePage";


class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                </Switch>
                <Route path="/(.+)" render={() => (
                    <div>
                        <NavBar/>
                        <Container className="main">
                            <Switch>
                                <Route path="/events" component={EventDashboard}/>
                                <Route path="/event/:id" component={EventDetailedPage}/>
                                <Route path="/manage/:id" component={EventForm}/>
                                <Route path="/people" component={PeopleDashboard}/>
                                <Route path="/profile/:id" component={UserDetailed}/>
                                <Route path="/settings" component={SettingsDashboard}/>
                                <Route path="/createEvent" component={EventForm}/>
                            </Switch>
                        </Container>
                    </div>
                )
                }/>
            </div>
        );
    }
}

export default App;
