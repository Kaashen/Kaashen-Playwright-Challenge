export class ApiHelper {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  get authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Cookie': `token=${this.token}`,
    };
  }

  async getToken(credentials) {
    const response = await this.request.post('/auth', { data: credentials });
    const body = await response.json();
    this.token = body.token;
    return this.token;
  }

  async getBookings() {
    return this.request.get('/booking');
  }

  async getBooking(id) {
    return this.request.get(`/booking/${id}`);
  }

  async createBooking(data) {
    return this.request.post('/booking', {
      data,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async updateBooking(id, data) {
    return this.request.put(`/booking/${id}`, {
      data,
      headers: this.authHeaders,
    });
  }

  async partialUpdateBooking(id, data) {
    return this.request.patch(`/booking/${id}`, {
      data,
      headers: this.authHeaders,
    });
  }

  async deleteBooking(id) {
    return this.request.delete(`/booking/${id}`, {
      headers: this.authHeaders,
    });
  }
}