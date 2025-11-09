module.exports = {
    apps: [
      {
        name: "crm",
        script: "start.js",
        args: "run start",
        cwd: "C:\\ReportApp", // مسیر پروژه
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  