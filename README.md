# E-Commerce Plataform

Full-stack application for e-commerce management, featuring catalog filtering, stock administration, order processing, and automated notifications. Developed with Node.js (Express) and Next.js under a REST API architecture with MongoDB persistence. The project integrates an automated testing cycle with Jest for unit tests and Cypress for end-to-end (E2E) testing, ensuring software quality and stability. It includes technical documentation through Swagger and the use of Docker for deploying the solution on Render (backend) and Netlify (frontend), guaranteeing a stable and documented production environment.

[📄 View Project Requirements](https://github.com/nvelascopinto/TP-DDSO-2C2025/blob/main/Enunciado.pdf)

## Technologies
- **Backend:** Node.js, Express
- **Frontend:** Next.js, React
- **Database:** MongoDB Atlas
- **Testing:** Jest, Cypress
- **Infrastructure:** Docker, Render (Backend), Netlify (Frontend)

## Deployment Summary

### Database (MongoDB Atlas)
* **Cluster:** `tienda_sol_db` hosted on AWS (sa-east-1).
* **Access:** Configured via IP Access List to allow Render's traffic.
* **Connection:** Established using the `MONGODB_PROD` URI string.

### Backend (Render)
* **Service Type:** Dockerized Web Service (Oregon Region).
* **Deployment:** Pre-built Docker images pushed to Docker Hub.
* **Health Check:** Configured at the `/health-check` endpoint.
* **Environment Variables:** `MONGODB_PROD` linked to the Atlas cluster.

### Frontend (Netlify)
* **CI/CD:** Connected via GitHub with a `/tienda-sol-frontend` base directory.
* **Build Command:** `npm install && npm run build`.
* **Environment Variables:** `VITE_API_URL` pointing to the Render backend service.

## Development Team
- Nicole Velasco [@nvelascopinto](https://github.com/nvelascopinto)
- Agustina Duric [@agustinaduric](https://github.com/agustinaduric)
- Milagros Salafia [@MilagrosLu](https://github.com/MilagrosLu)
- Maitena Aguero [@maiteaguero](https://github.com/maiteaguero)
