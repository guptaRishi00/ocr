import { useState, useEffect } from "react";

interface Contact {
  id: number;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  status: string;
  tags: string[];
  lastContact?: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  ocrResponse?: {
    id: number;
    originalName?: string;
    createdAt: string;
  };
}

interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

interface UseContactsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export function useContacts(options: UseContactsOptions = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page.toString());
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.search) params.append("search", options.search);
      if (options.status) params.append("status", options.status);

      const response = await fetch(`/api/contacts?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data: ContactsResponse = await response.json();
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [options.page, options.limit, options.search, options.status]);

  const createContact = async (contactData: Partial<Contact>) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error("Failed to create contact");
      }

      const newContact = await response.json();
      await fetchContacts(); // Refresh the list
      return newContact;
    } catch (err) {
      throw err;
    }
  };

  const updateContact = async (id: number, contactData: Partial<Contact>) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact");
      }

      const updatedContact = await response.json();
      await fetchContacts(); // Refresh the list
      return updatedContact;
    } catch (err) {
      throw err;
    }
  };

  const deleteContact = async (id: number) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      await fetchContacts(); // Refresh the list
      return true;
    } catch (err) {
      throw err;
    }
  };

  return {
    contacts,
    pagination,
    loading,
    error,
    refetch: fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}
