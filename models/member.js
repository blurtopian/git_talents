const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const { AttendanceItem } = require('./attendance_item');
const { MemberAttendance } = require('./member_attendance');

const MemberSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  profilePic: {
    data: Buffer,
    contentType: String,
  },
  address: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
  },
  baptismDate:{
    type: Date,
  },
  birthDate:{
    type: Date,
  },
  groupName: {
    type: String,
  },
  // this is the member's church id as officially registered in AMS
  churchId: {
    type: String,
    unique: true,
  },
  // this is the member's digital church id in MCGI Hub
  digitalChurchId: {
    type: String,
  },
  // this is the automatically generated id of the locale (church)
  localeChurchId: {
    type: ObjectId,
    ref: 'LocaleChurch',
  },
  assignedLocales: [
    {
      type: ObjectId,
      ref: 'LocaleChurch',
    }
  ],
  monitoredBankAccounts: [
    {
      type: ObjectId,
      ref: 'BankAccount',
    }
  ],
  churchGroupId: {
    type: ObjectId,
    ref: 'ChurchGroup',
  },
  ministryId: {
    type: ObjectId,
    ref: 'Ministry',
  },
  ministries: [{
    type: ObjectId,
    ref: 'Ministry',
  }],
  memberType: {
    type: String,
  },
  voiceDesignation: {
    type: String,
  },
  isYouth: {
    type: Boolean,
  },
  isWorker: {
    type: Boolean,
  },
  isUnderProbationary: {
    type: Boolean,
  },
  isAdmin: {
    type: Boolean,
  },
  isVisiting: {
    type: Boolean,
  },
  isMonitored: {
    type: Boolean,
    default: false,
  },
  isInJapan: {
    type: Boolean,
    default: false
  },
  isInCountry: {
    type: Boolean,
    default: false,
  },
  isNotify: {
    type: Boolean,
    default: false,
  },
  isKapiAssociate: {
    type: Boolean,
    default: false,
  },
  isEnableOtp: {
    type: Boolean,
    default: false,
  },
  roles: [{
    type: String,
  }],
  lineLink: {
    type: String,
  },
},{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

MemberSchema.pre('findOneAndDelete', { query: true, document: false }, function(next) {
  const { _id } = this.getQuery();
  AttendanceItem.deleteMany({ memberId: _id }).exec();
  MemberAttendance.deleteMany({ memberId: _id }).exec();
  next();
});

MemberSchema.plugin(uniqueValidator);

var diffHistory = require("mongoose-diff-history/diffHistory").plugin;
MemberSchema.plugin(diffHistory, {
  omit: [
    'updatedBy', 'updatedBy', 'createdAt', 'updatedAt', 'profilePic',
  ],
  uri: process.env.MONGODB_URI,
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = { Member };