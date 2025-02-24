module.exports = {
  up: (pgm) => {
    pgm.createTable("users", {
      id: {
        type: "uuid",
        primaryKey: true,
        default: pgm.func("gen_random_uuid()"),
      },
      username: { type: "varchar(255)", notNull: true, unique: true },
      password: { type: "varchar(255)", notNull: true },
      created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    });
  },

  down: (pgm) => {
    pgm.dropTable("users");
  },
};
