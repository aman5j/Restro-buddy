import Chart from "../../components/DashboardComponent/Chart";
import Deposits from "../../components/Deposits";
import { Grid,Paper } from "@mui/material";
import Title from "../../components/Title";
import Order from './Order'

export default function Summary(props)
{
    return(<div>
        <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                
                  <Chart />
                </Paper>
              </Grid>

              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>

               {/* Recent Deposits */}
               <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                
                  <Order />
                </Paper>
              </Grid>
              
        </Grid>        
    </div>)
}