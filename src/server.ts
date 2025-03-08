import app from "./app";
import {prismaClient} from "./config/db";
import {logger} from "./config/logger";
import config from "./config/config";


const checkDatabaseConnection = async () => {
    try {
        await prismaClient.$connect();
        logger.info("Successfully connected to the database");
    } catch (error) {
        logger.error("Failed to connect to the database", error);
        process.exit(1);
    }
};

// Call function check db
checkDatabaseConnection();

app.listen(config.port, () => {
    logger.info(`Server running on localhost:${config.port}`);
});
