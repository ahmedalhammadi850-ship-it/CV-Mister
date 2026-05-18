const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "cv-mister-e4bbc";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function toField(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toField) } };
  if (typeof v === "object") return { mapValue: { fields: toFields(v) } };
  return { stringValue: String(v) };
}

function toFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) fields[k] = toField(v);
  }
  return fields;
}

function fromField(f) {
  if (!f) return null;
  if ("nullValue" in f) return null;
  if ("booleanValue" in f) return f.booleanValue;
  if ("integerValue" in f) return parseInt(f.integerValue, 10);
  if ("doubleValue" in f) return f.doubleValue;
  if ("stringValue" in f) return f.stringValue;
  if ("timestampValue" in f) return f.timestampValue;
  if ("arrayValue" in f) return (f.arrayValue.values || []).map(fromField);
  if ("mapValue" in f) return fromFields(f.mapValue.fields || {});
  return null;
}

function fromFields(fields) {
  const obj = {};
  for (const [k, v] of Object.entries(fields || {})) obj[k] = fromField(v);
  return obj;
}

class DocSnap {
  constructor(id, rawData) {
    this.id = id;
    this.exists = rawData !== null;
    this._data = rawData;
  }
  data() { return this._data; }
}

class QuerySnap {
  constructor(docs) {
    this.docs = docs;
    this.empty = docs.length === 0;
    this.size = docs.length;
  }
}

class DocRef {
  constructor(token, col, id) {
    this._token = token;
    this._col = col;
    this._id = id;
    this._url = `${BASE}/${col}/${id}`;
    this._h = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }

  async get() {
    const r = await fetch(this._url, { headers: this._h });
    if (r.status === 404 || r.status === 403) return new DocSnap(this._id, null);
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Firestore GET ${r.status}`);
    }
    const d = await r.json();
    return new DocSnap(this._id, fromFields(d.fields));
  }

  async set(data) {
    const r = await fetch(this._url, {
      method: "PATCH",
      headers: this._h,
      body: JSON.stringify({ fields: toFields(data) }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Firestore SET ${r.status}`);
    }
  }

  async update(data) {
    const mask = Object.keys(data)
      .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
      .join("&");
    const r = await fetch(`${this._url}?${mask}`, {
      method: "PATCH",
      headers: this._h,
      body: JSON.stringify({ fields: toFields(data) }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Firestore UPDATE ${r.status}`);
    }
  }

  async delete() {
    await fetch(this._url, { method: "DELETE", headers: this._h });
  }
}

class QueryBuilder {
  constructor(token, col, filters = []) {
    this._token = token;
    this._col = col;
    this._filters = filters;
    this._h = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }

  where(field, op, value) {
    return new QueryBuilder(this._token, this._col, [...this._filters, { field, op, value }]);
  }

  async get() {
    const ff = (f) => ({
      fieldFilter: { field: { fieldPath: f.field }, op: "EQUAL", value: toField(f.value) },
    });
    const where =
      this._filters.length === 1
        ? ff(this._filters[0])
        : { compositeFilter: { op: "AND", filters: this._filters.map(ff) } };

    const r = await fetch(`${BASE}:runQuery`, {
      method: "POST",
      headers: this._h,
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: this._col }], where } }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Firestore QUERY ${r.status}`);
    }
    const results = await r.json();
    const docs = results
      .filter((item) => item.document)
      .map((item) => {
        const parts = item.document.name.split("/");
        return new DocSnap(parts[parts.length - 1], fromFields(item.document.fields));
      });
    return new QuerySnap(docs);
  }
}

class RestDb {
  constructor(token) { this._token = token; }
  collection(name) {
    const t = this._token;
    return {
      doc: (id) => new DocRef(t, name, id),
      where: (field, op, value) => new QueryBuilder(t, name, [{ field, op, value }]),
    };
  }
}

export function createRestDb(token) {
  return new RestDb(token);
}
