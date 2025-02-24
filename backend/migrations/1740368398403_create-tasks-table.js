module.exports = {
  up: (pgm) => {
    pgm.createTable("tasks", {
      id: {
        type: "uuid",
        primaryKey: true,
        default: pgm.func("gen_random_uuid()"),
      },
      title: { type: "varchar(255)", notNull: true },
      description: { type: "text" },
      isComplete: { type: "boolean", default: false },
      userId: {
        type: "uuid",
        references: "users(id)",
        onDelete: "CASCADE",
      },
      created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    });
  },

  down: (pgm) => {
    pgm.dropTable("tasks");
  },
};
