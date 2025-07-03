import React from 'react';
import AppLayout from '../components/AppLayout';
import TripPlanMain from '../components/tripPlan/TripPlanMain';
import TripPlanSearch from '../components/tripPlan/TripPlanSearch';

const Home = () => {


    return (
        <AppLayout>
            <TripPlanMain />
            <TripPlanSearch />
        </AppLayout>
    );
};

export default Home;