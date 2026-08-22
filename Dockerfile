FROM mcr.microsoft.com/playwright:v1.62.1-jammy

# Skip browser downloads since they are pre-installed in the base image
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Establish working directory inside container
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm ci

# Copy project source code
COPY . .

# Set default execution to run the full regression test suite
CMD ["npx", "playwright", "test", "--workers=1"]
