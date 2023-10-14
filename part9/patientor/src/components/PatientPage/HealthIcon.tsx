import FavoriteIcon from '@mui/icons-material/Favorite';
import { HealthCheckRating } from '../../types';

interface HealthIconProps {
  rating: HealthCheckRating;
}

const HealthIcon = ( { rating }: HealthIconProps) => {

  switch (rating) {
    case HealthCheckRating.Healthy:
      return <FavoriteIcon sx={{ color: 'green' }}/>;

    case HealthCheckRating.LowRisk:
      return <FavoriteIcon sx={{ color: 'yellow' }}/>;
      
    case HealthCheckRating.HighRisk:
      return <FavoriteIcon sx={{ color: 'orange' }}/>;

    case HealthCheckRating.CriticalRisk:
      return <FavoriteIcon sx={{ color: 'red' }}/>;
  }
};

export default HealthIcon;