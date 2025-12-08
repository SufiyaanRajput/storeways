module.exports = (sequelize, DataTypes) => {
  const InviteCode = sequelize.define('InviteCode', {
		id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
	}, {
    underscored: true,
		timestamps: false
  });

	return InviteCode;
};