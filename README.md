# devs-kafka-consumer
This test project is offering a local kafka topic consumer

### includes
- [nextjs](https://nextjs.org/)
- [react](https://react.dev/)
- [tailwind css](https://tailwindcss.com/)
- [kafkaJS](https://kafka.js.org/)
- [cloudevents](https://cloudevents.io/)
- [dotenv](https://github.com/motdotla/dotenv)
- [pnpm](https://pnpm.io/)

## requirements
- pnpm

## usage
1. create a `.env` file containing:
   - KAFKA_CLIENT_ID, 
   - KAFKA_USERNAME, 
   - KAFKA_PASSWORD, 
   - KAFKA_BROKERS
2. run `pnpm i` to install the packages
3. start local debugging with `pnpm run dev`
4. go to the url [localhost](http://localhost:3000/)