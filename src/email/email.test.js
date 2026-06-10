/**
 * email.test.js — amulyaachari18 (Email & Scheduler Lead)
 * Tests for all email modules
 * Run: node email.test.js
 */

import { EmailDraft } from './draft.js';
import { EmailScheduler } from './scheduler.js';
import { RecipientResolver } from './recipients.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('✅ PASS:', name);
    passed++;
  } catch (e) {
    console.log('❌ FAIL:', name, '→', e.message);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// ── EmailDraft Tests ──
test('Draft builds from transcript', () => {
  const d = new EmailDraft();
  d.fromTranscript('Hello doctor I need to reschedule');
  assert(d.body === 'Hello doctor I need to reschedule', 'body mismatch');
  assert(d.subject.includes('Hello'), 'subject should start with first words');
});

test('Draft generates subject from first 6 words', () => {
  const d = new EmailDraft();
  d.fromTranscript('one two three four five six seven eight');
  assert(d.subject.endsWith('…'), 'subject should end with ellipsis');
});

test('Draft isValid returns false without recipient', () => {
  const d = new EmailDraft();
  d.fromTranscript('Hello world');
  assert(!d.isValid(), 'should be invalid without email');
});

test('Draft isValid returns true with recipient', () => {
  const d = new EmailDraft();
  d.fromTranscript('Hello world');
  d.setRecipient('test@example.com');
  assert(d.isValid(), 'should be valid with email');
});

// ── EmailScheduler Tests ──
test('Scheduler returns null for now', () => {
  assert(EmailScheduler.parse('now') === null, 'now should return null');
});

test('Scheduler parses 1 hour correctly', () => {
  const date = EmailScheduler.parse('1 hour');
  const diff = date - new Date();
  assert(diff > 3500000 && diff < 3700000, '1 hour should be ~3600000ms');
});

test('Scheduler parses tomorrow correctly', () => {
  const date = EmailScheduler.parse('tomorrow');
  assert(date.getHours() === 9, 'tomorrow should be at 9am');
  assert(date > new Date(), 'tomorrow should be in the future');
});

test('Scheduler formats date to readable string', () => {
  const date = EmailScheduler.parse('tomorrow');
  const formatted = EmailScheduler.format(date);
  assert(typeof formatted === 'string' && formatted.length > 0, 'format should return string');
});

// ── RecipientResolver Tests ──
test('Resolver finds doctor by name', () => {
  const r = new RecipientResolver(RecipientResolver.defaultContacts());
  const email = r.findByName('doctor');
  assert(email === 'doctor@clinic.com', 'should find doctor email');
});

test('Resolver parses send to phrase', () => {
  const r = new RecipientResolver(RecipientResolver.defaultContacts());
  const email = r.resolveFromPhrase('send to doctor');
  assert(email === 'doctor@clinic.com', 'should resolve from phrase');
});

test('Resolver returns null for unknown contact', () => {
  const r = new RecipientResolver(RecipientResolver.defaultContacts());
  const email = r.findByName('unknownperson');
  assert(email === null, 'should return null for unknown');
});

// ── Summary ──
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log('🎉 All tests passed!');
