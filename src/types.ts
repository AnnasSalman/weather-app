export interface IWeatherForecast{
    cod: string;
    
    message?: number;

    cnt?: number;

    list: {
        dt: number;
        main: {
            temp: number
            feels_like: number
            temp_min: number
            temp_max: number
            pressure: number
            humidity: number
            sea_level: number
            grnd_level: number
            temp_kf: number
        };
        weather: {
            id: number
            main: string
            description: string
            icon: string
        }[];
        clouds?: {};
        wind: {
            speed: number,
            deg: number,
            gust: number
        };
        visibility: number;
        pop: number;
        sys?: {};
        dt_txt: string;
    }[];

    city: {
        id: number;
        name: string;
        coord: {};
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    }
}